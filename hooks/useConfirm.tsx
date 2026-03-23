'use client';

import { useState, useCallback } from 'react';
import ConfirmModal from '../components/ConfirmModal';

interface ConfirmOptions {
  message: string;
  confirmLabel?: string;
}

export function useConfirm() {
  const [pending, setPending] = useState<{
    options: ConfirmOptions;
    resolve: (value: boolean) => void;
  } | null>(null);

  const confirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setPending({ options, resolve });
    });
  }, []);

  const handleConfirm = useCallback(() => {
    pending?.resolve(true);
    setPending(null);
  }, [pending]);

  const handleCancel = useCallback(() => {
    pending?.resolve(false);
    setPending(null);
  }, [pending]);

  const ConfirmDialog = pending ? (
    <ConfirmModal
      message={pending.options.message}
      confirmLabel={pending.options.confirmLabel}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
    />
  ) : null;

  return { confirm, ConfirmDialog };
}
