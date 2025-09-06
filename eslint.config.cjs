const { FlatCompat } = require('@eslint/eslintrc');
const path = require('path');
const js = require('@eslint/js');
const fs = require('fs');

const compat = new FlatCompat({ baseDirectory: __dirname });

// essayer de convertir .eslintrc.json ; fallback si un subpath interne d'un package n'est pas exporté
let compatConfigs = [];
try {
  compatConfigs = compat.extends('./.eslintrc.json');
} catch (err) {
  try {
    const rcPath = require('path').join(__dirname, '.eslintrc.json');
    if (fs.existsSync(rcPath)) {
      const rc = JSON.parse(fs.readFileSync(rcPath, 'utf8'));
      const exts = rc.extends ? (Array.isArray(rc.extends) ? rc.extends : [rc.extends]) : [];
      const filtered = exts.filter(e => e !== 'eslint:recommended' && e !== 'eslint:all');
      if (filtered.length) {
        compatConfigs = compat.extends(...filtered);
      } else {
        compatConfigs = [];
      }
    }
  } catch (inner) {
    compatConfigs = [];
  }
}

module.exports = [
  // utiliser la config recommandée depuis @eslint/js (évite require('eslint/conf/...'))
  js.configs.recommended,
  // ajouter les conversions de FlatCompat (si présentes)
  ...compatConfigs,
  {
    files: ['**/*.js', 'scripts/**'],
    // Laisser le parser JS par défaut (espree) pour ces fichiers afin d'éviter
    // que les règles @typescript-eslint appellent context.getScope.
    rules: {
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off'
    },
  },

];
