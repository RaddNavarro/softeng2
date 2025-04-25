import { Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { Props } from '../navigation/props'

const Rewards: React.FC<Props> = ({ navigation }) =>  {
    return (
        <View>
            <Text>Rewards Page</Text>
        </View>
    )
}

export default Rewards;