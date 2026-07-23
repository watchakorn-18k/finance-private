import sodium from 'libsodium-wrappers';
const [GH_TOKEN, KEY_ID, PUBLIC_KEY, NAME, VALUE] = process.argv.slice(2);
await sodium.ready;
const pubKey = Buffer.from(PUBLIC_KEY, 'base64');
const enc = sodium.crypto_box_seal(VALUE, pubKey);
const b64 = Buffer.from(enc).toString('base64');
const url = `https://api.github.com/repos/watchakorn-18k/finance-private/actions/secrets/${NAME}`;
const res = await fetch(url, {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${GH_TOKEN}`,
    'Accept': 'application/vnd.github+json',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ encrypted_value: b64, key_id: KEY_ID })
});
console.log(`${NAME}: ${res.status === 201 ? 'CREATED' : res.status === 204 ? 'UPDATED' : 'FAIL ' + res.status}`);
