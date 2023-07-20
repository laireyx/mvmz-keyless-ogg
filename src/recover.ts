export default async function recoverFile(encryptedOggFile: File) {
  const ab = await encryptedOggFile.arrayBuffer();

  // Slice first 32 Bytes.
  const headersStripped = ab.slice(16);

  const dataView = new DataView(headersStripped);

  const magicNumber = [0x4f, 0x67, 0x67, 0x53, 0x00, 0x00];
  let bsSerialNumber: number[] = [];

  for (let i = 16; i < dataView.byteLength - magicNumber.length; i++) {
    let found = true;

    for (let j = 0; j < magicNumber.length; j++) {
      if (dataView.getUint8(i + j) !== magicNumber[j]) {
        found = false;
        break;
      }
    }

    if (!found) continue;

    bsSerialNumber.push(dataView.getUint8(i + 14));
    bsSerialNumber.push(dataView.getUint8(i + 15));

    break;
  }

  const recoveredHeader = [
    0x4f,
    0x67,
    0x67,
    0x53,
    0x00,
    0x02,
    0x00,
    0x00,
    0x00,
    0x00,
    0x00,
    0x00,
    0x00,
    0x00,
    ...bsSerialNumber,
  ];

  for (let i = 0; i < recoveredHeader.length; i++) {
    dataView.setUint8(i, recoveredHeader[i]);
  }

  const recoveredArrayBuffer = dataView.buffer;

  return new File(
    [recoveredArrayBuffer],
    // Strip _ at the end of the filename.
    encryptedOggFile.name.replace(/_$/, ""),
    {
      lastModified: encryptedOggFile.lastModified,
      type: encryptedOggFile.type,
    }
  );
}
