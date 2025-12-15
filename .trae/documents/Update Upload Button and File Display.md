I will update the `DocumentRow` component in `src/app/dashboard/vistos/novo/page.tsx` to:

1. **Rename the button** to "Upload" and ensure it uses the Upload icon.
2. **Display uploaded files** below the input field as a list of document icons.
3. **Support multiple files**: Clicking the upload button multiple times will add more files, which will be listed below with a "link icon/document symbol" that opens the file in a new tab when clicked.

This involves:

* Importing `FileText` from `lucide-react`.

* Modifying `DocumentRow` to aggregate all uploaded URLs (primary + extras) for the field.

* Rendering these URLs as clickable links with icons below the input area.

