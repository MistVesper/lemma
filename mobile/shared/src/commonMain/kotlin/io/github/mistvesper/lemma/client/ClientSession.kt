package io.github.mistvesper.lemma.client

/**
 * A session summary; [title] is empty until the session is renamed, and [updatedAt] is the epoch
 * millisecond of its last change. [activeMessageId] is the user message of its running turn.
 */
data class ClientSession(
    val id: String,
    val title: String,
    val updatedAt: Long,
    val activeMessageId: String? = null,
)
