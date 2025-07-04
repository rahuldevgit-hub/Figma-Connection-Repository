'use client';

import React, { useEffect, useRef } from 'react';
import 'summernote/dist/summernote-lite.css';
import $ from 'jquery';
import 'summernote/dist/summernote-lite.js';

interface SummernoteEditorProps {
  value: string;
  onChange: (html: string) => void;
}

export default function SummernoteEditor({ value, onChange }: SummernoteEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const $el = $(editorRef.current!);
    $el.summernote({
      height: 250,
      callbacks: {
        onChange: (contents: string) => {
          onChange(contents);
        },
      },
    });

    $el.summernote('code', value); // Set initial value

    return () => {
      $el.summernote('destroy');
    };
  }, [value]);

  return <div ref={editorRef} />;
}
