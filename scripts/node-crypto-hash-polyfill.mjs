import nodeCrypto from 'node:crypto';

const { webcrypto, createHash, randomFillSync, randomUUID } = nodeCrypto;

const cryptoTarget = globalThis.crypto ?? webcrypto ?? {};

if (!globalThis.crypto) {
  globalThis.crypto = cryptoTarget;
}

if (webcrypto && globalThis.crypto !== webcrypto) {
  for (const key of Reflect.ownKeys(webcrypto)) {
    if (!(key in globalThis.crypto)) {
      const descriptor = Object.getOwnPropertyDescriptor(webcrypto, key);
      if (descriptor) {
        Object.defineProperty(globalThis.crypto, key, descriptor);
      }
    }
  }
}

const ensureHash = () => {
  if (typeof globalThis.crypto.hash === 'function' && typeof nodeCrypto.hash === 'function') {
    return;
  }

  const hashPolyfill = function hash(algorithm, data, outputEncoding = 'hex') {
    const hash = createHash(algorithm);
    if (typeof data === 'string' || ArrayBuffer.isView(data) || data instanceof ArrayBuffer) {
      hash.update(data);
    } else {
      hash.update(Buffer.from(data));
    }
    return outputEncoding ? hash.digest(outputEncoding) : hash.digest();
  };

  if (typeof globalThis.crypto.hash !== 'function') {
    globalThis.crypto.hash = hashPolyfill;
  }

  if (typeof nodeCrypto.hash !== 'function') {
    Object.defineProperty(nodeCrypto, 'hash', {
      configurable: true,
      enumerable: true,
      writable: true,
      value: hashPolyfill,
    });
  }
};

ensureHash();

if (typeof globalThis.crypto.getRandomValues !== 'function') {
  if (webcrypto && typeof webcrypto.getRandomValues === 'function') {
    globalThis.crypto.getRandomValues = (...args) => webcrypto.getRandomValues(...args);
  } else if (typeof randomFillSync === 'function') {
    globalThis.crypto.getRandomValues = (typedArray) => {
      if (!typedArray || typeof typedArray.length !== 'number') {
        throw new TypeError('Expected a typed array in crypto.getRandomValues polyfill.');
      }
      return randomFillSync(typedArray);
    };
  }
}

if (typeof globalThis.crypto.randomUUID !== 'function') {
  if (typeof randomUUID === 'function') {
    globalThis.crypto.randomUUID = randomUUID.bind(nodeCrypto);
  } else if (typeof globalThis.crypto.getRandomValues === 'function') {
    globalThis.crypto.randomUUID = () => {
      const bytes = new Uint8Array(16);
      globalThis.crypto.getRandomValues(bytes);

      // Per RFC 4122 section 4.4, set the version and variant bits.
      bytes[6] = (bytes[6] & 0x0f) | 0x40;
      bytes[8] = (bytes[8] & 0x3f) | 0x80;

      const byteToHex = (value) => value.toString(16).padStart(2, '0');
      const hex = Array.from(bytes, byteToHex);

      return `${hex.slice(0, 4).join('')}-${hex.slice(4, 6).join('')}-${hex.slice(6, 8).join('')}-${hex.slice(8, 10).join('')}-${hex.slice(10, 16).join('')}`;
    };
  }
}
