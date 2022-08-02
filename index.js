/** @type {import('../../../fake_node_modules/powercord/entities/').default} */
const { Plugin } = require('powercord/entities');
const { FluxDispatcher, React, getModule } = require('powercord/webpack');
const Settings = require('./components/Settings');
class PINGWHENONLINE extends Plugin {
    constructor(props) {
        super(props);
        this.idk = {};
    }
    startPlugin() {
        powercord.api.settings.registerSettings(this.entityID, {
            category: this.entityID,
            label: 'Notify Presence idk man',
            render: Settings,
        });
        FluxDispatcher.subscribe('PRESENCE_UPDATES', this.handlePresence.bind(this));
        this.userStore = getModule(['getCurrentUser', 'getUser'], false);
    }

    handlePresence({ updates: [update] }) {
        const people = this.settings.get('toNotify', []);
        const userId = people.find((id) => update.user.id === id);
        if (!userId || this.idk[update.user.id]?.status === update.status) return;
        console.log(update);
        this.idk[update.user.id] = update;
        this.playAudio(this.settings.get('notificationSoundUrl', ''));
        if (!update.user.username) {
            const user = this.userStore.getUser(update.user.id);
            return this.sendToast(user.username, update.status);
        }
        return this.sendToast(update.user.username, update.status);
    }

    sendToast(username, status) {
        if (this.settings.get('useXeno', false)) {
            return XenoLib.Notifications.info(`${username} IS ${status.toUpperCase()} WOAH`, {
                timeout: this.settings.get('timeout', 5000),
            });
        }
        return powercord.api.notices.sendToast('user-notifer', {
            type: 'success',
            header: 'ONLINE NOTIFER',
            content: `${username} IS ${status.toUpperCase()} :O`,
            buttons: [
                {
                    text: 'Dismiss',
                    color: 'green',
                    look: 'outlined',
                    onClick: () => powercord.api.notices.closeToast('user-notifer'),
                },
            ],
            timeout: 5e3,
        });
    }

    playAudio(url) {
        if (url.length) {
            const audio = new Audio(url);
            audio.play();
        }
    }

    pluginWillUnload() {
        powercord.api.settings.unregisterSettings(this.entityID);
        FluxDispatcher.unsubscribe('PRESENCE_UPDATES', this.handlePresence.bind(this));
    }
}

module.exports = PINGWHENONLINE;
