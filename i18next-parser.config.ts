export default {
    createOldCatalogs: false,
    // Save the \_old files

    indentation: 4,
    // Indentation of the catalog files

    locales: ['en', 'de'],
    // An array of the locales in your applications

    output: 'src/lib/locales/$LOCALE/$NAMESPACE.json'
    // Supports $LOCALE and $NAMESPACE injection
    // Supports JSON (.json) and YAML (.yml) file formats
    // Where to write the locale files relative to process.cwd()
};
