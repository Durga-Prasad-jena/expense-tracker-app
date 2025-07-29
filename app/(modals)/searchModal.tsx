import BackButton from "@/components/BackButton";
import Header from "@/components/Header";
import ModalWrapper from "@/components/ModalWrapper";
import TransactionList from "@/components/TransactionList";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/contexts/authContext";
import useFetchData from "@/hooks/useFetchData";
import { TransactionType } from "@/types";
import { scale } from "@/utils/styling";
import { limit, orderBy, where } from "firebase/firestore";
import React, { useState } from "react";
import { ScrollView, StyleSheet, TextInput, View } from "react-native";
import { widthPercentageToDP } from "react-native-responsive-screen";

const SearchModal = () => {

    const { user } = useAuth();
    const [search, setSearch] = useState("")
    const {
        data: allTransaction,
        error,
        loading: transactionLoading
    } = useFetchData<TransactionType>('transaction', [
        where('uid', '==', user?.uid),
        orderBy('date', 'desc'),
        limit(30)
    ])

    const filterTransactions = allTransaction.filter((item) => {
        if (search.length > 0) {
            if (item.category?.toLowerCase().includes(search.toLowerCase())
                || item.description?.toLowerCase().includes(search.toLowerCase())
                || item.type.toLowerCase().includes(search.toLowerCase())) {
                return true
            } else {
                return false
            }
        }
        return true;
    })

    return (
        <ModalWrapper style={{ backgroundColor: colors.neutral900 }}>
            <View style={styles.container}>
                <Header
                    title={"Search"}
                    leftIcon={<BackButton />}
                    style={{ marginBottom: spacingY._10 }}
                />
                <ScrollView contentContainerStyle={styles.form}>
                    <View style={styles.inputContainer}>

                        <TextInput
                            placeholder="Search..."
                            value={search}
                            onChangeText={(value) => setSearch(value)}
                            style={styles.input}
                            placeholderTextColor={colors.neutral500}
                        />
                        <TransactionList
                            data={filterTransactions}
                            emptyListMessage="No Transaction match your search keyword"
                            loading={transactionLoading}
                        />
                    </View>

                </ScrollView>

            </View>
        </ModalWrapper>
    );
};

export default SearchModal;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: spacingX._10,
    },
    form: {
        paddingVertical: spacingY._15,
        gap: spacingY._30,
        paddingBottom: scale(100)
    },

    inputContainer: {
        gap: spacingY._10,
        marginHorizontal: widthPercentageToDP(5),
        // backgroundColor:colors.neutral800
    },
    input: {
        borderWidth: 1,
        borderColor: colors.neutral600,
        borderRadius: radius._10,
        paddingLeft: 10,
        color: colors.white
    }


});
