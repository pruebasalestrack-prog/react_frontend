import usersData from "../../../shared/data/users.json"

// Simular carga de datos de usuario desde JSON
export const loginUser = async (email, password) => {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 800))

  // Buscar usuario en el JSON
  const user = usersData.users.find((u) => u.email === email && u.password === password)

  if (!user) {
    throw new Error("Credenciales inválidas. Por favor, verifica tu email y contraseña.")
  }

  // 🔒 IMPORTANTE: Guardar la contraseña temporalmente para el session lock
  // NOTA: Esto es solo para desarrollo/demo. En producción, usa tokens JWT o similar
  localStorage.setItem('userPassword', password)

  // Cargar datos de la base de datos asignada al usuario
  const dbModule = await import(`../../../shared/data/databases/${user.database}.json`)
  const dbData = dbModule.default

  return {
    id: user.id,
    email: user.email,
    username: user.username,
    role: user.role,
    database: user.database,
    databaseData: dbData,
  }
}

/* 
  INTEGRACIÓN CON API REAL:
  
  Cuando tengas tu backend listo, descomenta y modifica esta función:
  
  export const loginUser = async (email, password) => {
    try {
      const response = await fetch('https://tu-api.com/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Credenciales inválidas');
      }

      const data = await response.json();
      
      // Para el session lock, guarda un token de refresco o similar
      localStorage.setItem('refreshToken', data.refreshToken);
      
      return data;
    } catch (error) {
      throw error;
    }
  };
  
  // Para validar el desbloqueo con tu API:
  export const validateUnlock = async (password) => {
    try {
      const response = await fetch('https://tu-api.com/api/auth/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('refreshToken')}`
        },
        body: JSON.stringify({ password }),
      });

      return response.ok;
    } catch (error) {
      return false;
    }
  };
*/