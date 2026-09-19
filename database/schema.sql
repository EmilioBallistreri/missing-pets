-- ============================================================================
-- PATITAS A CASA - ESQUEMA DE BASE DE DATOS PROFESIONAL (PostgreSQL / Supabase)
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------------------------------
-- ENUMS
-- ----------------------------------------------------------------------------
CREATE TYPE pet_status_enum AS ENUM (
    'perdido',
    'encontrado',
    'adopcion',
    'reunido',
    'adoptado',
    'archivado'
);

CREATE TYPE pet_species_enum AS ENUM (
    'perro',
    'gato',
    'otro'
);

CREATE TYPE pet_gender_enum AS ENUM (
    'Macho',
    'Hembra',
    'Desconocido'
);

CREATE TYPE pet_size_enum AS ENUM (
    'pequeño',
    'mediano',
    'grande'
);

CREATE TYPE user_role_enum AS ENUM (
    'ciudadano',
    'rescatista',
    'refugio_verificado',
    'admin'
);

CREATE TYPE flag_reason_enum AS ENUM (
    'estafa_recompensa',
    'datos_falsos',
    'venta_ilegal',
    'contenido_inapropiado',
    'mascota_ya_encontrada'
);

CREATE TYPE sighting_certainty_enum AS ENUM (
    'alta',
    'media',
    'baja'
);

-- ----------------------------------------------------------------------------
-- TABLA: USERS (Usuarios y Tutores)
-- ----------------------------------------------------------------------------
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    phone_verified BOOLEAN DEFAULT FALSE,
    avatar_url TEXT,
    role user_role_enum DEFAULT 'ciudadano',
    neighborhood VARCHAR(100),
    city VARCHAR(100) DEFAULT 'Buenos Aires',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- TABLA: PETS (Publicaciones de Mascotas)
-- ----------------------------------------------------------------------------
CREATE TABLE pets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    status pet_status_enum NOT NULL DEFAULT 'perdido',
    name VARCHAR(100),
    species pet_species_enum NOT NULL,
    breed VARCHAR(100) DEFAULT 'Mestizo',
    gender pet_gender_enum DEFAULT 'Desconocido',
    size pet_size_enum DEFAULT 'mediano',
    age VARCHAR(50),
    color VARCHAR(100),
    distinctive_features TEXT,
    description TEXT NOT NULL,
    reward VARCHAR(50),
    is_urgent BOOLEAN DEFAULT TRUE,
    rescue_before_image TEXT, -- Foto del día del rescate (para adopciones Antes y Después)
    
    -- Datos de Ubicación y Geoespaciales
    address TEXT,
    neighborhood VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL DEFAULT 'Buenos Aires',
    geom GEOGRAPHY(Point, 4326) NOT NULL,
    
    -- Columna calculada de Búsqueda de Texto Completo en Español
    search_vector tsvector GENERATED ALWAYS AS (
        to_tsvector('spanish', 
            coalesce(name, '') || ' ' || 
            coalesce(breed, '') || ' ' || 
            coalesce(color, '') || ' ' || 
            coalesce(distinctive_features, '') || ' ' || 
            coalesce(neighborhood, '') || ' ' || 
            coalesce(description, '')
        )
    ) STORED,

    -- Fechas
    last_seen_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices geoespaciales y Full-Text Search
CREATE INDEX idx_pets_geom ON pets USING GIST(geom);
CREATE INDEX idx_pets_fts ON pets USING GIN(search_vector);
CREATE INDEX idx_pets_status ON pets(status);
CREATE INDEX idx_pets_species ON pets(species);
CREATE INDEX idx_pets_created_at ON pets(created_at DESC);

-- ----------------------------------------------------------------------------
-- TABLA: PET_MEDIA (Galería de Fotos)
-- ----------------------------------------------------------------------------
CREATE TABLE pet_media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    thumbnail_url TEXT,
    is_primary BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_pet_media_pet_id ON pet_media(pet_id);

-- ----------------------------------------------------------------------------
-- TABLA: SIGHTINGS (Avistamientos con Certeza y Foto)
-- ----------------------------------------------------------------------------
CREATE TABLE sightings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
    reporter_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    reporter_name VARCHAR(100) NOT NULL,
    reporter_phone VARCHAR(30),
    location_text TEXT NOT NULL,
    geom GEOGRAPHY(Point, 4326),
    certainty sighting_certainty_enum DEFAULT 'media',
    notes TEXT NOT NULL,
    photo_url TEXT,
    confirmed_by_owner BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_sightings_pet_id ON sightings(pet_id);
CREATE INDEX idx_sightings_geom ON sightings USING GIST(geom);

-- ----------------------------------------------------------------------------
-- TABLA: GEO_SUBSCRIPTIONS (Alertas Vecinales por Radio)
-- ----------------------------------------------------------------------------
CREATE TABLE geo_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    geom GEOGRAPHY(Point, 4326) NOT NULL,
    radius_meters DOUBLE PRECISION DEFAULT 3000,
    notify_lost BOOLEAN DEFAULT TRUE,
    notify_found BOOLEAN DEFAULT TRUE,
    fcm_token TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_geo_subscriptions_geom ON geo_subscriptions USING GIST(geom);

-- ----------------------------------------------------------------------------
-- TABLA: REPORT_FLAGS (Moderación y Denuncias)
-- ----------------------------------------------------------------------------
CREATE TABLE report_flags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
    reporter_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    reason flag_reason_enum NOT NULL,
    details TEXT,
    status VARCHAR(30) DEFAULT 'pendiente_revision',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_report_flags_pet_id ON report_flags(pet_id);

-- ----------------------------------------------------------------------------
-- FUNCIÓN: Matching Inteligente entre Mascotas Perdidas y Encontradas
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION find_potential_pet_matches(target_pet_id UUID)
RETURNS TABLE (
    candidate_id UUID,
    name VARCHAR,
    species pet_species_enum,
    status pet_status_enum,
    breed VARCHAR,
    neighborhood VARCHAR,
    distance_meters DOUBLE PRECISION,
    match_score INT
) AS $$
DECLARE
    target_record RECORD;
BEGIN
    SELECT * INTO target_record FROM pets WHERE id = target_pet_id;
    IF NOT FOUND THEN
        RETURN;
    END IF;

    RETURN QUERY
    SELECT 
        p.id AS candidate_id,
        p.name,
        p.species,
        p.status,
        p.breed,
        p.neighborhood,
        ST_Distance(p.geom, target_record.geom) AS distance_meters,
        (
            -- Puntaje de compatibilidad 0 a 100
            (CASE WHEN p.species = target_record.species THEN 35 ELSE 0 END) +
            (CASE WHEN p.gender = target_record.gender THEN 20 ELSE 5 END) +
            (CASE WHEN p.size = target_record.size THEN 20 ELSE 5 END) +
            (CASE WHEN ST_Distance(p.geom, target_record.geom) <= 2000 THEN 25
                  WHEN ST_Distance(p.geom, target_record.geom) <= 5000 THEN 15
                  ELSE 5 END)
        )::INT AS match_score
    FROM pets p
    WHERE p.id <> target_pet_id
      AND (
          (target_record.status = 'perdido' AND p.status = 'encontrado') OR
          (target_record.status = 'encontrado' AND p.status = 'perdido')
      )
      AND p.species = target_record.species
      AND ST_DWithin(p.geom, target_record.geom, 10000) -- radio máx 10 km
    ORDER BY match_score DESC, distance_meters ASC
    LIMIT 10;
END;
$$ LANGUAGE plpgsql;

-- ----------------------------------------------------------------------------
-- POLÍTICAS DE SEGURIDAD (Row Level Security - RLS)
-- ----------------------------------------------------------------------------
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE sightings ENABLE ROW LEVEL SECURITY;
ALTER TABLE geo_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_flags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for pets" ON pets FOR SELECT USING (true);
CREATE POLICY "Public read access for sightings" ON sightings FOR SELECT USING (true);
CREATE POLICY "Enable insert for pets" ON pets FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable insert for sightings" ON sightings FOR INSERT WITH CHECK (true);
