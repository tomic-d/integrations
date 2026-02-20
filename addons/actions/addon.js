import divhunt from 'divhunt';

const actions = divhunt.Addon('actions', (addon) =>
{
    addon.Field('id', ['string']);
    addon.Field('provider_id', ['string']);
    addon.Field('name', ['string']);
    addon.Field('description', ['string', '']);
    addon.Field('input', ['object', {}]);
    addon.Field('output', ['object', {}]);
    addon.Field('execute', ['function']);
});

export default actions;
