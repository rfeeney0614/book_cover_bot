import React, { useState, useEffect } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import { fetchBooks } from '../api/books';
import { fetchBook } from '../api/books';

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
    
    // Check if book already in options
    const existingBook = options.find(b => b.id === value);
    if (existingBook) {
      setSelectedBook(existingBook);
      return;
    }
    
    // If not in options yet, fetch the specific book
    let active = true;
    fetchBook(value)
      .then((book) => {
        if (!active) return;
        setSelectedBook(book);
        // Add to options if not already there
        setOptions(prev => {
          if (prev.some(b => b.id === book.id)) return prev;
          return [book, ...prev];
        });
      })
      .catch(() => {
        // If fetch fails, try to find in existing options
        const found = options.find(b => b.id === value);
        if (found) setSelectedBook(found);
      });
    
    return () => { active = false; };
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
