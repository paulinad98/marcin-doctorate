export function downloadFile(file: Blob, fileName: string) {
  const fileURL = URL.createObjectURL(file);
  const link = document.createElement("a");

  link.href = fileURL;
  link.download = fileName;

  link.click();
  link.remove();
}
