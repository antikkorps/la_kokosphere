import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'legalDocument',
  title: 'Documents légaux',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Titre du document',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'type',
      title: 'Type de document',
      type: 'string',
      options: {
        list: [
          {title: "Attestation d'assurance", value: 'insurance'},
          {title: 'Diplôme', value: 'diploma'},
          {title: 'Certification', value: 'certification'},
          {title: 'Autre document légal', value: 'other'},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'file',
      title: 'Fichier PDF',
      type: 'file',
      options: {
        accept: '.pdf',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'validUntil',
      title: "Valide jusqu'au",
      type: 'date',
      description: "Date d'expiration du document (optionnel)",
    }),
    defineField({
      name: 'isPublic',
      title: 'Visible sur le site public',
      type: 'boolean',
      initialValue: true,
      description: 'Décochez si ce document ne doit pas être visible publiquement',
    }),
    defineField({
      name: 'order',
      title: "Ordre d'affichage",
      type: 'number',
      initialValue: 0,
    }),
  ],
  orderings: [
    {
      title: "Ordre d'affichage",
      name: 'orderAsc',
      by: [{field: 'order', direction: 'asc'}],
    },
    {
      title: 'Type de document',
      name: 'typeAsc',
      by: [{field: 'type', direction: 'asc'}],
    },
  ],
  preview: {
    select: {
      title: 'title',
      type: 'type',
      media: 'file',
    },
    prepare(selection) {
      const {title, type} = selection
      const typeLabels = {
        insurance: 'Assurance',
        diploma: 'Diplôme',
        certification: 'Certification',
        other: 'Autre',
      }
      return {
        title: title,
        subtitle: typeLabels[type as keyof typeof typeLabels] || type,
      }
    },
  },
})
