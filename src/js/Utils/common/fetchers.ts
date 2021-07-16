
export async function fetchAsync(url: string) {
    const response = await fetch(url);
    const json = await response.json();

    return json;
}
