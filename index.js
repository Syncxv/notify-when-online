/** @type {import('../../../fake_node_modules/powercord/entities/').default} */
const { Plugin } = require("powercord/entities");
const { FluxDispatcher, React, getModule } = require("powercord/webpack");
const Settings = require("./components/Settings");
class PINGWHENONLINE extends Plugin {
    startPlugin() {
        powercord.api.settings.registerSettings(this.entityID, {
            category: this.entityID,
            label: "Notify Presence idk man",
            render: Settings,
        });
        FluxDispatcher.subscribe("PRESENCE_UPDATE", this.handlePresence.bind(this));
        this.userStore = getModule(["getCurrentUser", "getUser"], false);
    }

    handlePresence(presence) {
        const people = this.settings.get("toNotify", []);
        people.forEach((id) => {
            if (presence.user.id === id) {
                console.log(presence.status);
                console.log(this.settings.get("useXeno"));
                if (XenoLib && this.settings.get("useXeno", false)) {
                    if (!presence.user.username) {
                        const user = this.userStore.getUser(user.id);
                        return XenoLib.Notifications.info(`${user.username} IS ${presence.status.toUpperCase()} WOAH`, { timeout: 5000 });
                    }
                    return XenoLib.Notifications.info(`${presence.user.username} IS ${presence.status.toUpperCase()} :O`, { timeout: 5000 });
                }

                powercord.api.notices.sendToast("hehe", {
                    type: "success",
                    header: "ONLINE NOTIFER",
                    content: `${presence.user.username} IS ${presence.status.toUpperCase()} :O`,
                    buttons: [
                        {
                            text: "Dismiss",
                            color: "green",
                            look: "outlined",
                            onClick: () => powercord.api.notices.closeToast("remountNotif"),
                        },
                    ],
                    timeout: 5e3,
                });
            }
        });
    }

    sendToast() {}

    pluginWillUnload() {
        powercord.api.settings.unregisterSettings(this.entityID);
        FluxDispatcher.unsubscribe("PRESENCE_UPDATE", this.handlePresence);
    }
}

module.exports = PINGWHENONLINE;
