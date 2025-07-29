import BackButton from "@/components/BackButton";
import Button from "@/components/Button";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { colors, radius, spacingX } from "@/constants/theme";
import { useAuth } from "@/contexts/authContext";
import { scale } from "@/utils/styling";
import React, { useState } from "react";
import { Alert, StyleSheet, TextInput, View } from "react-native";
const ForgotPassword = () => {
    const [email, setEmail] = useState<string>("")
    const [loading,setLoading]=useState<boolean>(false)
    const {forgotPassword} = useAuth()
    const handleSendOtp = async () => {
        try {
            if(!email){
                Alert.alert("Forgot Password","Please enter email")
            }
           const res = await forgotPassword(email);
           console.log("res--forgotpassword",res)
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <ScreenWrapper>
            <View style={styles.container}>
           <BackButton/>
                <View style={{marginTop:scale(150)}}>
                    <Typo size={22} fontWeight={"bold"} color={colors.neutral300} style={{ textAlign: "center" }}>Password reset</Typo>
                <Typo size={14} color={colors.neutral500} style={{ textAlign: "center" }}>you will recieve instructions for resetting your password </Typo>
                <View >
                    <Typo>Email</Typo>
                    <TextInput
                        placeholder="Enter Email"
                        value={email}
                        onChangeText={(value) => setEmail(value)}
                        style={styles.input}
                        placeholderTextColor={colors.neutral500}
                    />
                    <Button style={{ width: "100%" }}
                        onPress={handleSendOtp}>
                        <Typo>Send Otp</Typo>
                    </Button>
                </View>
                </View>
            </View>
        </ScreenWrapper>
    );
};

export default ForgotPassword;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: spacingX._15,
        // justifyContent: "center",
        gap: 10
    },
    input: {
        borderWidth: 1,
        borderColor: colors.neutral600,
        borderRadius: radius._10,
        paddingLeft: 10,
        color: colors.white,
        width: "100%"
    }

});
