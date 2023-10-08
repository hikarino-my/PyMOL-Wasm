/*
Usage:
import text from "./import_python.js?path=sample.py";

console.log(text);
*/
const url = new URL(import.meta.url);
const path = "python/" + url.searchParams.get("path");
const response = await fetch(path);
const text = await response.text();

export default text;
