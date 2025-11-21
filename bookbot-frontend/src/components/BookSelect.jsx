import React, { useState, useEffect } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import { fetchBooks } from '../api/books';

export default function BookSelect({ value, onChange, placeholder = 'Select book...' }) {
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  // Load the initially selected book if value exists
  useEffect(() => {
    if (!value) {
      setSelectedBook(null);
      return;
    }
    
    const existingBook = options.find(b => b.id === value);
    if (existingBook) {
      setSelectedBook(existingBook);
    }
  }, [value, options]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchBooks({ search: inputValue })
      .then((data) => {
        if (!active) return;
        const books = Array.isArray(data.books) ? data.books : data;
        setOptions(books);
      })
      .catch(() => setOptions([]))
      .finally(() => setLoading(false));
    return () => { active = false; };
  }, [inputValue]);

  return (
    <Autocomplete
      value={selectedBook}
      onChange={(e, newValue) => onChange && onChange(newValue?.id || '')}
      inputValue={inputValue}
      onInputChange={(e, newInputValue) => setInputValue(newInputValue)}
      options={options}
      getOptionLabel={(option) => `${option.title}${option.author ? ` by ${option.author}` : ''}`}
      loading={loading}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={placeholder}
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
}
