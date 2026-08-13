export const setMeta = (selector: string, attributes: Record<string, string>) => {
    let element = document.head.querySelector<HTMLMetaElement>(selector);
    if (!element) {
        element = document.createElement('meta');
        document.head.appendChild(element);
    }
    Object.entries(attributes).forEach(([name, value]) => element?.setAttribute(name, value));
};

export const setCanonical = (url: string) => {
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
        canonical = document.createElement('link');
        canonical.rel = 'canonical';
        document.head.appendChild(canonical);
    }
    canonical.href = url;
};

export const setJsonLd = (id: string, data: object) => {
    let script = document.head.querySelector<HTMLScriptElement>(`script[data-seo-id="${id}"]`);
    if (!script) {
        script = document.createElement('script');
        script.type = 'application/ld+json';
        script.dataset.seoId = id;
        document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(data);
};

export const removeJsonLd = (id: string) => {
    document.head.querySelector(`script[data-seo-id="${id}"]`)?.remove();
};
