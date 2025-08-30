import { useCallback } from 'react';

interface ToastOptions {
  title: string;
  description?: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
}

export const useToast = () => {
  const showToast = useCallback((options: ToastOptions) => {
    const { title, description, type = 'info', duration = 5000 } = options;
    
    // Crear el elemento toast
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <div>
        <h4 class="font-semibold">${title}</h4>
        ${description ? `<p class="text-sm mt-1">${description}</p>` : ''}
      </div>
    `;
    
    // Agregar al DOM
    document.body.appendChild(toast);
    
    // Remover después del tiempo especificado
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, duration);
    
    // Permitir cerrar manualmente
    toast.addEventListener('click', () => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    });
  }, []);

  return { showToast };
};
