export default {
  name: 'post',
  title: 'Articles de blog',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Titre',
      type: 'string',
      description:
        'Sert aussi de balise <title> : au-delà de 60 caractères, Google tronque en résultat de recherche.',
      validation: (Rule: any) => [
        Rule.required(),
        Rule.max(60).warning('Au-delà de 60 caractères, le titre est coupé dans Google.'),
      ],
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'description',
      title: 'Description (méta-description SEO)',
      type: 'text',
      rows: 3,
      description:
        "Phrase affichée sous le titre dans les résultats Google. Entre 70 et 155 caractères, sur une seule ligne, sans retour à la ligne.",
      validation: (Rule: any) => [
        Rule.max(155).warning('Au-delà de 155 caractères, Google coupe la phrase.'),
        Rule.min(70).warning('Trop courte : décrivez le contenu de l’article en une phrase complète.'),
        Rule.custom((value: string | undefined) =>
          value && /[\r\n]/.test(value)
            ? 'Retirez les retours à la ligne : la description doit tenir sur une seule ligne.'
            : true,
        ),
      ],
    },
    {
      name: 'author',
      title: 'Auteur',
      type: 'reference',
      to: [{type: 'author'}],
    },
    {
      name: 'mainImage',
      title: 'Image principale',
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
    },
    {
      name: 'categories',
      title: 'Catégories',
      type: 'array',
      of: [{type: 'reference', to: {type: 'category'}}],
    },
    {
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        layout: 'tags',
      },
      description: 'Mots-clés pour organiser et rechercher les articles',
    },
    {
      name: 'publishedAt',
      title: 'Date de publication',
      type: 'datetime',
      description:
        "Obligatoire : sans date, l'article perd son signal de fraîcheur dans les résultats de recherche.",
      initialValue: () => new Date().toISOString(),
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'body',
      title: 'Contenu',
      type: 'blockContent',
    },
  ],

  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'mainImage',
    },
    prepare(selection: any) {
      const {author} = selection
      return {...selection, subtitle: author && `par ${author}`}
    },
  },
}
