import {
    collection, addDoc, updateDoc, doc, onSnapshot, setDoc,
    query, where, serverTimestamp, getDoc, getDocs,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

// ─── Corridors ────────────────────────────────────────────────────────────────

export async function createCorridor(uid, data) {
    return addDoc(collection(db, 'corridors'), {
        uid,
        ...data,
        status: 'active',
        createdAt: serverTimestamp(),
    });
}

export async function terminateCorridor(corridorId) {
    await updateDoc(doc(db, 'corridors', corridorId), {
        status: 'terminated',
        terminatedAt: serverTimestamp(),
    });
}

// Real-time listener for active corridors
export function subscribeActiveCOrridors(callback) {
    const q = query(
        collection(db, 'corridors'),
        where('status', '==', 'active')
    );
    return onSnapshot(q, snap => {
        const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        // Sort client-side newest first
        docs.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
        callback(docs);
    });
}

// All corridors (admin only)
export function subscribeAllCorridors(callback) {
    const q = query(collection(db, 'corridors'));
    return onSnapshot(q, snap => {
        const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        docs.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
        callback(docs);
    });
}

// ─── Users ───────────────────────────────────────────────────────────────────

export async function getUserProfile(uid) {
    const snap = await getDoc(doc(db, 'users', uid));
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export function subscribeAllUsers(callback) {
    return onSnapshot(collection(db, 'users'), snap => {
        callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
}

export async function setUserRole(uid, role) {
    await setDoc(doc(db, 'users', uid), { role }, { merge: true });
}

export async function setUserVerification(uid, verified) {
    await setDoc(doc(db, 'users', uid), { verified }, { merge: true });
}

// ─── Signals ─────────────────────────────────────────────────────────────────

export async function setSignalStatus(intersectionId, status, adminUid) {
    await setDoc(doc(db, 'signals', intersectionId), {
        status,
        overriddenBy: adminUid,
        updatedAt: serverTimestamp(),
    }, { merge: true });
}

export function subscribeSignals(callback) {
    return onSnapshot(collection(db, 'signals'), snap => {
        const signals = {};
        snap.docs.forEach(d => { signals[d.id] = { id: d.id, ...d.data() }; });
        callback(signals);
    });
}
