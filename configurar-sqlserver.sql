-- configurar-sqlserver.sql
-- Ejecuta este script en SQL Server Management Studio

USE [master]
GO

PRINT '=== CONFIGURACIÓN SQL SERVER PARA DOCKER ==='
PRINT ''

-- 1. Habilitar autenticación mixta
PRINT '1. Habilitando autenticación mixta...'
EXEC xp_instance_regwrite N'HKEY_LOCAL_MACHINE', 
     N'Software\Microsoft\MSSQLServer\MSSQLServer',
     N'LoginMode', REG_DWORD, 2
GO

-- 2. Eliminar usuario anterior si existe
PRINT '2. Limpiando usuarios anteriores...'
USE [RT_Secury_PRD]
GO
IF EXISTS (SELECT * FROM sys.database_principals WHERE name = 'laravel_user')
BEGIN
    DROP USER laravel_user
    PRINT '   Usuario laravel_user eliminado de la base de datos'
END
GO

USE [master]
GO
IF EXISTS (SELECT * FROM sys.server_principals WHERE name = 'laravel_user')
BEGIN
    DROP LOGIN laravel_user
    PRINT '   Login laravel_user eliminado'
END
GO

-- 3. Crear nuevo usuario
PRINT '3. Creando nuevo usuario laravel_user...'
CREATE LOGIN laravel_user WITH PASSWORD = 'Laravel2024!', CHECK_POLICY = OFF
GO
PRINT '   Login creado exitosamente'

USE [RT_Secury_PRD]
GO
CREATE USER laravel_user FOR LOGIN laravel_user
GO
PRINT '   Usuario creado en la base de datos'

-- 4. Asignar permisos
PRINT '4. Asignando permisos...'
ALTER ROLE db_owner ADD MEMBER laravel_user
GO
PRINT '   Permisos asignados'

-- 5. Verificar conexión
PRINT '5. Verificando usuario...'
SELECT 
    name as 'Login',
    type_desc as 'Tipo',
    is_disabled as 'Deshabilitado'
FROM sys.server_principals 
WHERE name = 'laravel_user'
GO

PRINT ''
PRINT '=== CONFIGURACIÓN COMPLETADA ==='
PRINT 'IMPORTANTE: Reinicia el servicio SQL Server para aplicar los cambios'
PRINT ''