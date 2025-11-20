import React, { useState, useEffect, useRef } from 'react';

export default function SearchControls({ onSearch, placeholder = 'Search...', disabled = false, initial = '' }) {
  const [value, setValue] = useState(initial || '');
  const debouncedRef = useRef(null);
  const firstRun = useRef(true);

  useEffect(() => {
    if (firstRun.current) {
      // Skip calling on mount to avoid an initial search that can trigger
      // duplicate loads and render loops in parent components.
      firstRun.current = false;
      return undefined;
    }

    if (debouncedRef.current) clearTimeout(debouncedRef.current);
    debouncedRef.current = setTimeout(() => {
      if (typeof onSearch === 'function') {
        // debug hook: log when SearchControls triggers a search
        // eslint-disable-next-line no-console
        console.debug('SearchControls: triggering onSearch', value);
        onSearch(value);
      }
    }, 350);
    return () => clearTimeout(debouncedRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const submit = () => {
    if (debouncedRef.current) clearTimeout(debouncedRef.current);
    if (typeof onSearch === 'function') onSearch(value);
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      submit();
    }
  };

  const inputRef = useRef(null);

  // Remove focus-restoring effect; focus loss is likely due to parent rerender, not value change.

  return (
    <div style={{ marginBottom: 12 }}>
      <input
        ref={inputRef}
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={onKeyDown}
        style={{ marginRight: 8 }}
        disabled={disabled}
      />
      <button onClick={submit} disabled={disabled}>Search</button>
    </div>
  );
}
