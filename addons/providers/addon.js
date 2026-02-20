import divhunt from 'divhunt';

const providers = divhunt.Addon('providers', (addon) =>
{
    addon.Field('id', ['string']);
    addon.Field('name', ['string']);
    addon.Field('slug', ['string']);
    addon.Field('description', ['string', '']);
    addon.Field('icon', ['string', '']);
    addon.Field('auth_type', ['string', 'oauth2']);
    addon.Field('oauth2', ['object', null]);
    addon.Field('api_key', ['object', null]);
    addon.Field('base_url', ['string']);
});

export default providers;
