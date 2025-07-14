export default {
  name: 'service',
  title: 'Services',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Titre',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'description',
      title: 'Description courte',
      type: 'text',
      rows: 3,
    },
    {
      name: 'image',
      title: 'Image',
      type: 'object',
      fields: [
        {
          name: 'type',
          title: "Type d'image",
          type: 'string',
          options: {
            list: [
              {title: "Upload d'image", value: 'upload'},
              {title: 'URL externe', value: 'url'},
            ],
            layout: 'radio',
          },
          validation: (Rule: any) => Rule.required(),
        },
        {
          name: 'uploadedImage',
          title: 'Image uploadée',
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Texte alternatif',
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
          hidden: ({parent}: any) => parent?.type !== 'upload',
        },
        {
          name: 'externalUrl',
          title: "URL de l'image",
          type: 'url',
          description: "Collez l'URL d'une image (Unsplash, etc.)",
          validation: (Rule: any) =>
            Rule.uri({
              scheme: ['http', 'https'],
            }),
          hidden: ({parent}: any) => parent?.type !== 'url',
        },
        {
          name: 'altText',
          title: 'Texte alternatif',
          type: 'string',
          description: "Description de l'image pour l'accessibilité",
          hidden: ({parent}: any) => parent?.type !== 'url',
        },
      ],
      preview: {
        select: {
          type: 'type',
          image: 'uploadedImage',
          url: 'externalUrl',
        },
        prepare(selection: any) {
          const {type, image, url} = selection
          return {
            title: type === 'upload' ? 'Image uploadée' : 'URL externe',
            subtitle: type === 'url' ? url : 'Image locale',
          }
        },
      },
    },
    {
      name: 'price',
      title: 'Prix',
      type: 'string',
      description: 'Ex: "80€" ou "Sur devis"',
    },
    {
      name: 'duration',
      title: 'Durée',
      type: 'string',
      description: 'Ex: "1h30" ou "Variable"',
    },
    {
      name: 'order',
      title: "Ordre d'affichage",
      type: 'number',
      description: 'Ordre dans la liste des services (1 = premier)',
    },
    {
      name: 'body',
      title: 'Contenu détaillé',
      type: 'blockContent',
    },
  ],

  preview: {
    select: {
      title: 'title',
      price: 'price',
      media: 'image.uploadedImage',
    },
    prepare(selection: any) {
      const {price} = selection
      return {...selection, subtitle: price && `Prix: ${price}`}
    },
  },
}
