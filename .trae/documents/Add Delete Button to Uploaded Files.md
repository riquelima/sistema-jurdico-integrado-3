I will add a delete functionality to the attached documents in `src/app/dashboard/vistos/novo/page.tsx`.

1.  **UI Update**: Add a small "X" icon (using `X` from `lucide-react`) to the top-right corner of the file icon container.
    *   It will be `absolute`, positioned top-right.
    *   It will be initially hidden or very subtle (`opacity-0` or low opacity), becoming fully visible on hover (`group-hover:opacity-100`).
    *   The container needs `relative` positioning.

2.  **Logic Update**:
    *   Implement a `handleRemoveFile(docField: string, fileUrl: string)` function.
    *   This function needs to:
        *   Check if the file is the "primary" one (stored in `formData[docField]`). If so, clear that field.
        *   Check if the file is in `extraUploads[docField]`. If so, filter it out from the array.
    *   Since `formData` and `extraUploads` are separate, I need to handle both states correctly to ensure the file disappears from the UI.

3.  **Prevent Default**: The "X" button must stop propagation (`e.stopPropagation()` and `e.preventDefault()`) so that clicking it doesn't trigger the link to open the file.

This fulfills the requirement: "icone 'x' no canto superior... ao passar o mouse... ao clicar exclui".