export default defineNitroPlugin((nitroApp) => {
    nitroApp.hooks.hook('render:html', (html, {event}) => {
        //Serving our html in dark mode during SSR
        html.htmlAttrs.push(`class="darkness"`);
    })
})