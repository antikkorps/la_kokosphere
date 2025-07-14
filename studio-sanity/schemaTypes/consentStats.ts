export default {
  name: 'consentStats',
  title: 'Statistiques de consentement cookies',
  type: 'document',
  fields: [
    {
      name: 'date',
      title: 'Date du consentement',
      type: 'datetime',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'ip',
      title: 'Adresse IP',
      type: 'string',
      description: "Adresse IP de l'utilisateur (anonymisée)",
    },
    {
      name: 'userAgent',
      title: 'User Agent',
      type: 'string',
      description: "Navigateur et système d'exploitation",
    },
    {
      name: 'method',
      title: 'Méthode de consentement',
      type: 'string',
      options: {
        list: [
          {title: 'Bannière initiale', value: 'banner'},
          {title: 'Paramètres avancés', value: 'settings'},
          {title: 'Rechargement de page', value: 'reload'},
        ],
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'consentChoices',
      title: 'Choix de consentement',
      type: 'object',
      fields: [
        {
          name: 'necessary',
          title: 'Cookies nécessaires',
          type: 'boolean',
          description: 'Toujours acceptés',
          initialValue: true,
          readOnly: true,
        },
        {
          name: 'analytics',
          title: 'Cookies analytiques',
          type: 'boolean',
          description: 'Google Analytics, etc.',
        },
        {
          name: 'marketing',
          title: 'Cookies marketing',
          type: 'boolean',
          description: 'Publicités, réseaux sociaux',
        },
      ],
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'expiresAt',
      title: "Date d'expiration",
      type: 'datetime',
      description: "Date automatique d'expiration (6 mois)",
      readOnly: true,
    },
  ],

  preview: {
    select: {
      date: 'date',
      method: 'method',
      analytics: 'consentChoices.analytics',
      marketing: 'consentChoices.marketing',
    },
    prepare(selection: any) {
      const {date, method, analytics, marketing} = selection
      const consentDate = new Date(date).toLocaleDateString('fr-FR')
      const choices = []
      if (analytics) choices.push('Analytics')
      if (marketing) choices.push('Marketing')

      return {
        title: `Consentement du ${consentDate}`,
        subtitle: `${method} - ${choices.length > 0 ? choices.join(', ') : 'Aucun cookie optionnel'}`,
        media: () => '🍪',
      }
    },
  },

  orderings: [
    {
      title: 'Date, Nouveau en premier',
      name: 'dateDesc',
      by: [{field: 'date', direction: 'desc'}],
    },
    {
      title: 'Date, Ancien en premier',
      name: 'dateAsc',
      by: [{field: 'date', direction: 'asc'}],
    },
  ],
}
