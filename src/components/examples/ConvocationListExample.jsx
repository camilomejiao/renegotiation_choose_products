import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { getConvocationColumns } from "../../../../helpers/utils/ConvocationProductColumns";
import StandardTable from "../../../shared/StandardTable";

/**
 * Ejemplo de componente usando StandardTable
 * Este es un ejemplo de cómo migrar componentes existentes para usar la nueva tabla estandarizada
 */
export const ConvocationListExample = () => {
  const [convocations, setConvocations] = useState([]);
  const [loading, setLoading] = useState(false);

  // Handlers para las acciones de la tabla
  const handleModalSuppliers = (row) => {
    console.log("Mostrar proveedores para:", row);
    // Lógica para mostrar modal de proveedores
  };

  const handleReport = (row) => {
    console.log("Generar reporte para:", row);
    // Lógica para generar reporte
  };

  // Configuración de columnas usando la función existente
  const columns = getConvocationColumns(handleModalSuppliers, handleReport);

  // Simulación de carga de datos
  useEffect(() => {
    const loadConvocations = async () => {
      setLoading(true);
      try {
        // Simular API call
        setTimeout(() => {
          const mockData = [
            {
              id: 1,
              date: "2025-01-15",
              name: "Convocatoria Ejemplo 1",
              plans: [
                { name: "Plan Productivo A" },
                { name: "Plan Productivo B" },
              ],
              status: "Activa",
              n_suppliers: 15,
            },
            {
              id: 2,
              date: "2025-02-01",
              name: "Convocatoria Ejemplo 2",
              plans: [{ name: "Plan Productivo C" }],
              status: "Cerrada",
              n_suppliers: 8,
            },
          ];
          setConvocations(mockData);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error cargando convocatorias:", error);
        setLoading(false);
      }
    };

    loadConvocations();
  }, []);

  return (
    <Box className="page-wrapper" sx={{ padding: 3 }}>
      {/* Header */}
      <Box className="page-header" sx={{ marginBottom: 3 }}>
        <Typography variant="h4" component="h1" className="page-header__title">
          Lista de Convocatorias
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Gestiona las convocatorias y sus proveedores asociados
        </Typography>
      </Box>

      {/* Tabla con el nuevo componente estandarizado */}
      <StandardTable
        rows={convocations}
        columns={columns}
        loading={loading}
        noRowsText="No hay convocatorias disponibles"
        customProps={{
          // Props específicas si necesitas override de las por defecto
          pageSizeOptions: [10, 25, 50, 100],
          initialState: {
            pagination: {
              paginationModel: { page: 0, pageSize: 25 },
            },
          },
        }}
        enableDynamicHeight={true}
      />
    </Box>
  );
};

export default ConvocationListExample;
