import './env.js';

/* Addons */
import '#providers/load.js';
import '#connections/load.js';
import '#actions/load.js';

/* Providers */
import './items/providers/slack.js';
import './items/providers/github.js';
import './items/providers/google-gmail.js';
import './items/providers/google-calendar.js';
import './items/providers/stripe.js';
import './items/providers/calendly.js';

/* Actions - Slack */
import './items/actions/slack/send-message.js';
import './items/actions/slack/list-channels.js';
import './items/actions/slack/create-channel.js';

/* Actions - GitHub */
import './items/actions/github/create-issue.js';
import './items/actions/github/list-repos.js';
import './items/actions/github/create-pr.js';

/* Actions - Google Gmail */
import './items/actions/google-gmail/send-email.js';
import './items/actions/google-gmail/list-emails.js';
import './items/actions/google-gmail/search-emails.js';

/* Actions - Google Calendar */
import './items/actions/google-calendar/create-event.js';
import './items/actions/google-calendar/list-events.js';
import './items/actions/google-calendar/delete-event.js';

/* Actions - Stripe */
import './items/actions/stripe/create-customer.js';
import './items/actions/stripe/list-customers.js';
import './items/actions/stripe/create-charge.js';

/* Actions - Calendly */
import './items/actions/calendly/list-events.js';
import './items/actions/calendly/list-event-types.js';

/* Database */
import './items/database/primary.js';

/* Commands */
import './items/commands/health.js';
import './items/commands/oauth.callback.js';

/* Servers */
import './items/servers/grpc.js';
import './items/servers/http.js';
