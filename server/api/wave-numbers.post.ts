import { getWaveNumberFile } from "@/features/wave-number/waveNumber";

export default defineEventHandler(async (event) => {
  const formDataBody = await readMultipartFormData(event);
  const params = [
    {
      name: "oddFile",
      type: "file",
    },
    {
      name: "evenFile",
      type: "file",
    },
    {
      name: "minWaveNumber",
      type: "number",
    },
    {
      name: "maxWaveNumber",
      type: "number",
    },
  ];

  const formData = new FormData();

  params.forEach((param) => {
    const value = formDataBody?.find((value) => value.name === param.name);

    if (!value?.data) {
      throw createError({
        statusCode: 422,
        statusMessage: `No ${param.name} in form data`,
      });
    }

    if (param.type === "number" && typeof +value.data !== "number") {
      throw createError({
        statusCode: 422,
        statusMessage: `Invalid ${param.name} in form data`,
      });
    }

    formData.append(
      param.name,
      param.type === "number"
        ? value.data.toString()
        : new Blob([value.data], { type: value.type })
    );
  });

  const evenFile = formData.get("evenFile");
  const oddFile = formData.get("oddFile");
  const minWaveNumber = formData.get("minWaveNumber");
  const maxWaveNumber = formData.get("maxWaveNumber");

  console.log(evenFile, oddFile, minWaveNumber, maxWaveNumber);

  const file = await getWaveNumberFile(
    oddFile,
    evenFile,
    minWaveNumber,
    maxWaveNumber
  );

  return file;
});
