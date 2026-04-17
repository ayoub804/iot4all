const bcrypt = require('bcryptjs');
const password = 'Admin@1234';
bcrypt.hash(password, 12, (err, hash) => {
    if (err) console.error(err);
    else console.log('Hashed password for "' + password + '":\n' + hash);
});
