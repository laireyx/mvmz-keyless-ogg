import recoverFile from "./recover";

window.addEventListener("load", () => {
  const oggFiles = document.querySelector<HTMLInputElement>("#oggs");

  if (!oggFiles) return;

  console.log(oggFiles);

  oggFiles.addEventListener("change", async () => {
    const fileCount = oggFiles.files?.length ?? 0;
    for (let fileIdx = 0; fileIdx < fileCount; fileIdx++) {
      const file = oggFiles.files?.item(fileIdx)!!;

      const recoveredFile = await recoverFile(file);

      // Create download link
      const anchorElem = document.createElement("a");
      anchorElem.href = URL.createObjectURL(recoveredFile);
      anchorElem.download = recoveredFile.name;
      document.body.appendChild(anchorElem);

      // Download and cleanup
      anchorElem.click();
      URL.revokeObjectURL(anchorElem.href);
      anchorElem.remove();
    }
  });
});

export default function foo() {
  return "bar";
}
