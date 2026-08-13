export const DT_CONTACT = {
    email: {
        display: 'snorsininster@gmail.com',
        href: 'mailto:snorsininster@gmail.com',
    },
    primary: {
        display: '010-7755-0118',
        href: 'tel:+821077550118',
    },
    secondary: {
        display: '010-8460-5703',
        href: 'tel:+821084605703',
    },
    facebook: 'https://www.facebook.com/a.t.g.ld.r.719276',
    messenger: 'https://m.me/a.t.g.ld.r.719276',
} as const;

export const DT_PHONE_SUMMARY = `${DT_CONTACT.primary.display} / ${DT_CONTACT.secondary.display}`;
