export default {
  name: 'kokosphere',
  title: 'La Kokosphere',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Titre principal',
      type: 'string',
      description: 'Le titre principal de la page Kokosphere',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'subtitle',
      title: 'Sous-titre',
      type: 'string',
      description: 'Le sous-titre (ex: "Qu\'est-ce que l\'hypnose ericksonienne ?")',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'intro',
      title: 'Introduction',
      type: 'text',
      rows: 5,
      description: 'Introduction générale à l\'hypnose ericksonienne',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'hypnoseDescription',
      title: 'Description complémentaire',
      type: 'text',
      rows: 3,
      description: 'Description complémentaire sur l\'hypnose (optionnel)',
    },
    {
      name: 'workDescription',
      title: 'Hypnose et travail - Description',
      type: 'text',
      rows: 4,
      description: 'Description de l\'hypnose dans le monde du travail',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'workBenefits',
      title: 'Hypnose et travail - Bénéfices',
      type: 'array',
      of: [
        {
          type: 'string',
          title: 'Bénéfice',
        },
      ],
      description: 'Liste des bénéfices de l\'hypnose en entreprise',
      validation: (Rule: any) => Rule.min(1).max(10),
    },
    {
      name: 'autoHypnoseDescription',
      title: 'Auto-hypnose - Description',
      type: 'text',
      rows: 5,
      description: 'Description de l\'auto-hypnose et de son utilité',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'whyChooseDescription',
      title: 'Pourquoi choisir la Kokosphere',
      type: 'text',
      rows: 5,
      description: 'Explication de pourquoi choisir la Kokosphere',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'approachDescription',
      title: 'Approche naturelle - Description',
      type: 'text',
      rows: 4,
      description: 'Description de l\'approche naturelle et sans danger',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'conclusion',
      title: 'Conclusion',
      type: 'text',
      rows: 4,
      description: 'Message de conclusion et d\'invitation à la transformation',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'isActive',
      title: 'Activer cette version',
      type: 'boolean',
      description: 'Seule la version active sera affichée sur le site',
      initialValue: true,
    },
    {
      name: 'lastUpdated',
      title: 'Dernière modification',
      type: 'datetime',
      readOnly: true,
      initialValue: () => new Date().toISOString(),
    },
  ],

  preview: {
    select: {
      title: 'title',
      isActive: 'isActive',
      lastUpdated: 'lastUpdated',
    },
    prepare(selection: any) {
      const { title, isActive, lastUpdated } = selection;
      const formattedDate = lastUpdated 
        ? new Date(lastUpdated).toLocaleDateString('fr-FR')
        : '';
      
      return {
        title: title || 'La Kokosphere',
        subtitle: `${isActive ? '✅ Active' : '⚪ Inactive'} • Modifié le ${formattedDate}`,
      };
    },
  },

  orderings: [
    {
      title: 'Par date de modification',
      name: 'lastUpdatedDesc',
      by: [
        { field: 'lastUpdated', direction: 'desc' },
      ],
    },
    {
      title: 'Active en premier',
      name: 'activeFirst',
      by: [
        { field: 'isActive', direction: 'desc' },
        { field: 'lastUpdated', direction: 'desc' },
      ],
    },
  ],
}