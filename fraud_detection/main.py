import requests
import os
from supabase_config import get_supabase_client
from detector import is_document_fraudulent

DOWNLOAD_DIR = "downloads"
os.makedirs(DOWNLOAD_DIR, exist_ok=True)

def main():
    supabase = get_supabase_client()
    response = supabase.table("user_documents_map").select("*").execute()

    if not response.data:
        print("No documents found in Supabase.")
        return

    document_types = ['aadhaar', 'ration', 'income', 'caste']

    for doc in response.data:
        user_id_in_docs = doc['user_id']
        doc_id = doc['id']
        is_user_fraudulent = False

        # ✅ Get the actual user name and income from "users" table
        user_data = supabase.table("users").select("name, annualIncome").eq("id", user_id_in_docs).single().execute()
        expected_name = user_data.data.get("name") if user_data.data else None
        expected_income = user_data.data.get("annualIncome") if user_data.data else None

        if not expected_name:
            print(f"❌ Could not fetch user name for user_id {user_id_in_docs}")
            continue

        for doc_type in document_types:
            url_key = f"{doc_type}_url"
            file_url = doc.get(url_key)

            if not file_url:
                print(f"Skipping {doc_type} for user {user_id_in_docs} - no file uploaded.")
                continue

            local_path = os.path.join(DOWNLOAD_DIR, f"{doc_id}_{doc_type}.pdf")

            try:
                response = requests.get(file_url)
                response.raise_for_status()
                with open(local_path, "wb") as f:
                    f.write(response.content)
            except Exception as e:
                print(f"❌ Failed to download {doc_type} for user {user_id_in_docs}: {e}")
                continue

            # ✅ Enhanced fraud detection with name and income match
            fraud, reason = is_document_fraudulent(
                file_path=local_path,
                expected_name=expected_name,
                doc_type=doc_type,
                expected_income=expected_income if doc_type == "income" else None
            )

            update_fields = {
                f"{doc_type}_fraud_detected": fraud,
                f"{doc_type}_fraud_reason": reason
            }

            if fraud:
                is_user_fraudulent = True

            print(f"[{user_id_in_docs}] {doc_type.upper()} - {'FRAUD' if fraud else 'OK'} | Reason: {reason}")

            # Update document record with per-document fraud result
            supabase.table("user_documents_map").update(update_fields).eq("id", doc_id).execute()

        # Update overall fraud status
        supabase.table("user_documents_map").update({
            "isFraudulent": is_user_fraudulent
        }).eq("id", doc_id).execute()

        print(f"✅ Document entry [{doc_id}] fraud status set to {'FRAUD' if is_user_fraudulent else 'GENUINE'}")

if __name__ == "__main__":
    main()
