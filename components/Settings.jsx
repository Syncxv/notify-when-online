const { React } = require("powercord/webpack");
const { Category, SwitchItem, TextInput, RadioGroup } = require("powercord/components/settings");

module.exports = class Settings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
        };
    }

    render() {
        return (
            <>
                <SwitchItem
                    value={this.props.getSetting("useXeno", false)}
                    onChange={() => this.props.toggleSetting("useXeno", false)}
                    note="Make sure you have xeno lib installed"
                >
                    Use XenoLib Notifactions
                </SwitchItem>
                <Category
                    name="THE PEOPLE"
                    description="you will get notifactions when they go online :O"
                    opened={this.state.isOpen}
                    onChange={() => this.setState({ isOpen: !this.state.isOpen })}
                >
                    <TextInput
                        defaultValue={this.props.getSetting("toNotify", []).join(", ")}
                        onChange={(u) =>
                            this.props.updateSetting(
                                "toNotify",
                                u.split(",").map((id) => id.trim())
                            )
                        }
                        note={<p>ENTER Ids seperated by commas</p>}
                    >
                        Users
                    </TextInput>
                </Category>
            </>
        );
    }
};
