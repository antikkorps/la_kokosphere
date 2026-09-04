export default {
  title: 'Block Content',
  name: 'blockContent',
  type: 'array',
  of: [
    {
      title: 'Block',
      type: 'block',
      // Pas de H1 : le titre de l'article est déjà le H1 de la page.
      // Un second H1 casse la hiérarchie sémantique et le référencement.
      styles: [
        {title: 'Normal', value: 'normal'},
        {title: 'Titre de section (H2)', value: 'h2'},
        {title: 'Sous-titre (H3)', value: 'h3'},
        {title: 'Sous-sous-titre (H4)', value: 'h4'},
        {title: 'Citation', value: 'blockquote'},
      ],
      lists: [
        {title: 'Bullet', value: 'bullet'},
        {title: 'Number', value: 'number'},
      ],
      marks: {
        decorators: [
          {title: 'Strong', value: 'strong'},
          {title: 'Emphasis', value: 'em'},
        ],
        annotations: [
          {
            title: 'URL',
            name: 'link',
            type: 'object',
            fields: [
              {
                title: 'URL',
                name: 'href',
                type: 'url',
              },
            ],
          },
        ],
      },
    },
    {
      type: 'image',
      options: {hotspot: true},
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          description: 'Important for SEO and accessibility.',
          fieldset: 'imageMetadata',
        },
      ],
      fieldsets: [
        {
          name: 'imageMetadata',
          title: "Métadonnées de l'image",
          options: {
            collapsible: true,
            collapsed: false,
          },
        },
      ],
    },
  ],
}
