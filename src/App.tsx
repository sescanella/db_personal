import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { Table } from '@/pages/Table';
import { FormularioInscripcion } from '@/pages/FormularioInscripcion';

export default function App() {
  const showForm = window.location.hash === '#formulario';
  
  return (
    <QueryClientProvider client={queryClient}>
      {showForm ? <FormularioInscripcion /> : <Table />}
    </QueryClientProvider>
  )
}
