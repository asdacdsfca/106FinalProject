
import root from '../root.svelte';
import { set_building } from '__sveltekit/environment';
import { set_assets } from '__sveltekit/paths';
import { set_private_env, set_public_env } from '../../../node_modules/@sveltejs/kit/src/runtime/shared-server.js';

export const options = {
	app_template_contains_nonce: false,
	csp: {"mode":"auto","directives":{"upgrade-insecure-requests":false,"block-all-mixed-content":false},"reportOnly":{"upgrade-insecure-requests":false,"block-all-mixed-content":false}},
	csrf_check_origin: true,
	embedded: false,
	env_public_prefix: 'PUBLIC_',
	hooks: null, // added lazily, via `get_hooks`
	preload_strategy: "modulepreload",
	root,
	service_worker: false,
	templates: {
		app: ({ head, body, assets, nonce, env }) => "<!DOCTYPE html>\n<html lang=\"en\">\n\t<head>\n\t\t<meta charset=\"utf-8\" />\n\t\t<link rel=\"icon\" href=\"" + assets + "/favicon.png\" />\n\t\t<meta name=\"viewport\" content=\"width=device-width\" />\n\t\t" + head + "\n\t\t<style>\n\t\t\tsvg { width: 100%; max-width: 960px; height: auto; }\n\t\t\t.region { fill: #cccccc; stroke: #000000; stroke-width: 1; }\n\t\t\t.region:hover { fill: #aaaaaa; }\n\t\t\ttext { font-family: Arial, sans-serif; font-size: 14px; fill: #000000; }\n\t\t</style>\n\t</head>\n\t<body data-sveltekit-preload-data=\"hover\">\n\t\t<svg viewBox=\"0 0 960 600\">\n\t\t\t<!-- South Region -->\n\t\t\t<path id=\"south\" class=\"region\" d=\"M300,300 L400,250 L500,300 L500,400 L400,450 L300,400 Z\" data-name=\"South Region\" />\n\t\t\t<!-- West Region -->\n\t\t\t<path id=\"west\" class=\"region\" d=\"M100,100 L300,150 L300,300 L200,350 L100,300 Z\" data-name=\"West Region\" />\n\t\t\t<!-- Northeast Region -->\n\t\t\t<path id=\"northeast\" class=\"region\" d=\"M700,100 L800,50 L900,100 L800,150 Z\" data-name=\"Northeast Region\" />\n\t\t\t<!-- Midwest Region -->\n\t\t\t<path id=\"midwest\" class=\"region\" d=\"M500,200 L700,150 L800,200 L700,250 Z\" data-name=\"Midwest Region\" />\n\t\t\t\n\t\t\t<!-- Labels -->\n\t\t\t<text x=\"350\" y=\"375\" text-anchor=\"middle\">South</text>\n\t\t\t<text x=\"200\" y=\"175\" text-anchor=\"middle\">West</text>\n\t\t\t<text x=\"800\" y=\"125\" text-anchor=\"middle\">Northeast</text>\n\t\t\t<text x=\"650\" y=\"225\" text-anchor=\"middle\">Midwest</text>\n\t\t</svg>\n\t\t\n\t\t<script>\n\t\t\tdocument.querySelectorAll('.region').forEach(item => {\n\t\t\t\titem.addEventListener('click', function() {\n\t\t\t\t\talert(`Region: ${this.getAttribute('data-name')}`);\n\t\t\t\t});\n\t\t\t});\n\t\t</script>\n\t\t<div style=\"display: contents\">" + body + "</div>\n\t</body>\n</html>\n",
		error: ({ status, message }) => "<!DOCTYPE html>\n<html lang=\"en\">\n\t<head>\n\t\t<meta charset=\"utf-8\" />\n\t\t<title>" + message + "</title>\n\n\t\t<style>\n\t\t\tbody {\n\t\t\t\t--bg: white;\n\t\t\t\t--fg: #222;\n\t\t\t\t--divider: #ccc;\n\t\t\t\tbackground: var(--bg);\n\t\t\t\tcolor: var(--fg);\n\t\t\t\tfont-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,\n\t\t\t\t\tUbuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;\n\t\t\t\tdisplay: flex;\n\t\t\t\talign-items: center;\n\t\t\t\tjustify-content: center;\n\t\t\t\theight: 100vh;\n\t\t\t}\n\n\t\t\t.error {\n\t\t\t\tdisplay: flex;\n\t\t\t\talign-items: center;\n\t\t\t\tmax-width: 32rem;\n\t\t\t\tmargin: 0 1rem;\n\t\t\t}\n\n\t\t\t.status {\n\t\t\t\tfont-weight: 200;\n\t\t\t\tfont-size: 3rem;\n\t\t\t\tline-height: 1;\n\t\t\t\tposition: relative;\n\t\t\t\ttop: -0.05rem;\n\t\t\t}\n\n\t\t\t.message {\n\t\t\t\tborder-left: 1px solid var(--divider);\n\t\t\t\tpadding: 0 0 0 1rem;\n\t\t\t\tmargin: 0 0 0 1rem;\n\t\t\t\tmin-height: 2.5rem;\n\t\t\t\tdisplay: flex;\n\t\t\t\talign-items: center;\n\t\t\t}\n\n\t\t\t.message h1 {\n\t\t\t\tfont-weight: 400;\n\t\t\t\tfont-size: 1em;\n\t\t\t\tmargin: 0;\n\t\t\t}\n\n\t\t\t@media (prefers-color-scheme: dark) {\n\t\t\t\tbody {\n\t\t\t\t\t--bg: #222;\n\t\t\t\t\t--fg: #ddd;\n\t\t\t\t\t--divider: #666;\n\t\t\t\t}\n\t\t\t}\n\t\t</style>\n\t</head>\n\t<body>\n\t\t<div class=\"error\">\n\t\t\t<span class=\"status\">" + status + "</span>\n\t\t\t<div class=\"message\">\n\t\t\t\t<h1>" + message + "</h1>\n\t\t\t</div>\n\t\t</div>\n\t</body>\n</html>\n"
	},
	version_hash: "e08e72"
};

export function get_hooks() {
	return {};
}

export { set_assets, set_building, set_private_env, set_public_env };
