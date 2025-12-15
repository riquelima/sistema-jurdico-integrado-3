I will modify the `DocumentRow` component in `src/app/dashboard/vistos/novo/page.tsx` to change how uploaded files are displayed.

Instead of a vertical list with names and separate link buttons:
1.  **Layout**: I will change the container to `flex flex-wrap gap-2` to display items side-by-side.
2.  **Content**: Each item will be just the file icon (using `FileText` or similar).
3.  **Interaction**:
    *   **Click**: The entire icon container will be a clickable link (`<a>`) opening the file in a new tab.
    *   **Hover**: I will add a `title` attribute (or a tooltip if UI components allow, but `title` is simpler and requested "ao passar o mouse") to the container so the filename appears on hover.
    *   **Styling**: I will style the container to look like a small button/badge that contains only the icon.

Current code structure for the list:
```tsx
<div className="grid grid-cols-1 gap-2 mt-2">
  {attachedFiles.map(...)}
</div>
```

New code structure:
```tsx
<div className="flex flex-wrap gap-2 mt-2">
  {attachedFiles.map((url, idx) => (
    <a href={url} target="_blank" title={fileName} ...>
      <FileText ... />
    </a>
  ))}
</div>
```

This aligns exactly with the user's request: "apenas o icone", "um ao lado do outro", "hover mostra o nome", "clicar abre o arquivo".