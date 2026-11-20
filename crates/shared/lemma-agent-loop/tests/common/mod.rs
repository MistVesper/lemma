use std::error::Error;

use lemma_agent_loop::TurnInput;
use lemma_core::{ContentBlock, Message, TextContent};
use lemma_model::ApiFormat;
use lemma_session::{LastModel, SessionService};
use sqlx::SqlitePool;
use uuid::Uuid;

/// Creates one session in `db`, a migrated SQLite database.
pub(crate) async fn new_session(db: &SqlitePool) -> Result<(SessionService, Uuid), Box<dyn Error>> {
    let sessions = SessionService::new(db.clone());
    let session_id = sessions.create(None).await?.id;
    Ok((sessions, session_id))
}

/// The turn input that continues the session `session_id`.
pub(crate) fn input(session_id: Uuid) -> TurnInput {
    TurnInput {
        session_id,
        user_message_id: Uuid::new_v4(),
        parent_id: None,
        user_message: Message::User {
            content: vec![ContentBlock::Text(TextContent {
                text: "hello".into(),
            })],
        },
        model: LastModel {
            provider_id: Uuid::new_v4(),
            model: "m".into(),
        },
        api_format: ApiFormat::OpenAiCompatible,
        tool_calling: true,
        system_prompt: None,
    }
}
