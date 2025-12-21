// components/form-asistencia.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import axios from 'axios';

const formSchema = z.object({
  idAsignacion: z.coerce.number().positive('Requerido'),
  idEstudiante: z.coerce.number().positive('Requerido'),
  asistencia: z.enum(['presente', 'falta', 'ausente', 'justificativo']),
});

type FormValues = z.infer<typeof formSchema>;

export default function AsistenciaForm({ onSuccess }: { onSuccess?: () => void }) {
  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      idAsignacion: 0,
      idEstudiante: 0,
      asistencia: 'presente',
    },
  });

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    try {
      await axios.post('/api/asistencias', data);
      alert('Asistencia registrada con éxito');
      form.reset();
      onSuccess?.();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error al registrar asistencia');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="idAsignacion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ID Asignación Clase</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Ej: 5" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="idEstudiante"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ID Estudiante</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Ej: 123" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="asistencia"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Asistencia</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="presente">Presente</SelectItem>
                  <SelectItem value="falta">Falta</SelectItem>
                  <SelectItem value="ausente">Ausente</SelectItem>
                  <SelectItem value="justificativo">Justificativo</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Guardando...' : 'Registrar Asistencia'}
        </Button>
      </form>
    </Form>
  );
}