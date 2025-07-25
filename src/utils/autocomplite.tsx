import type { ItemOut } from '../types/item';
import type { ReactNode } from 'react';

export function formatAutocompleteLabel(item: ItemOut): ReactNode {
  const maxLength = 42;

  const paddedName =
    item.name.length < maxLength
      ? item.name.padEnd(maxLength, ' ')
      : item.name.slice(0, maxLength - 3) + '…';

  return (
    <div style={{ fontFamily: 'monospace', whiteSpace: 'pre' }}>
      <span style={{ color: 'white' }}>{paddedName}</span>
      <span style={{ color: '#888' }}>{'|'} {item.category.name}</span>
    </div>
  );
}
