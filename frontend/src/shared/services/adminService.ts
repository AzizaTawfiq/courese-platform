const getApiBaseUrl = () => {
  const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL ?? '/api/v1';
  return configuredBaseUrl.endsWith('/')
    ? configuredBaseUrl
    : `${configuredBaseUrl}/`;
};

const resolveApiUrl = (path: string) =>
  new URL(path, getApiBaseUrl()).toString();
const scheduleFileDownloadUrl = resolveApiUrl('schedule-file/download');

const getFilenameFromDisposition = (value: string | null) => {
  if (!value) {
    return null;
  }

  const utf8Match = value.match(/filename\*=UTF-8''([^;]+)/i);
  if (utf8Match?.[1]) {
    return decodeURIComponent(utf8Match[1]);
  }

  const plainMatch = value.match(/filename="?([^"]+)"?/i);
  return plainMatch?.[1] ?? null;
};

const getFallbackFilename = (url: string) => {
  const pathname = new URL(url).pathname;
  const filename = pathname.split('/').pop();
  return filename && filename.length > 0 ? filename : 'training-schedule';
};

export const adminService = {
  async getScheduleFileDownloadUrl() {
    const response = await fetch(scheduleFileDownloadUrl, {
      credentials: 'include',
      method: 'HEAD',
    });

    if (response.status === 404) {
      return null;
    }

    if (response.ok) {
      return scheduleFileDownloadUrl;
    }

    throw new Error('Unable to resolve schedule file download URL.');
  },

  async downloadScheduleFile() {
    const response = await fetch(scheduleFileDownloadUrl, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Unable to download schedule file.');
    }

    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    const filename =
      getFilenameFromDisposition(response.headers.get('content-disposition')) ??
      getFallbackFilename(response.url);

    return {
      objectUrl,
      filename,
    };
  },
};
