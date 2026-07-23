const sodium = require('/tmp/node_modules/libsodium-wrappers/dist/modules/libsodium-wrappers.js')

async function main() {
  const [GH_TOKEN, KEY_ID, PUB_KEY_B64, SECRET_NAME, SECRET_VALUE] = process.argv.slice(2)
  await sodium.ready
  const pubKey = Buffer.from(PUB_KEY_B64, 'base64')
  const enc = sodium.crypto_box_seal(SECRET_VALUE, pubKey)
  const b64 = Buffer.from(enc).toString('base64')
  const url = `https://api.github.com/repos/watchakorn-18k/finance-private/actions/secrets/${SECRET_NAME}`
  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${GH_TOKEN}`,
      'Accept': 'application/vnd.github+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ encrypted_value: b64, key_id: KEY_ID }),
  })
  const result = res.status === 201 ? 'CREATED' : res.status === 204 ? 'UPDATED' : 'FAIL'
  console.log(`${SECRET_NAME}: ${result} (${res.status})`)
}

main().catch(console.error)
