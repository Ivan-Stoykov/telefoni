<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Review;

class ReviewController extends Controller
{
    public function storeReview(Request $request, $phoneId)
    {
        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'required|string|max:1000',
        ]);

        $exists = Review::where('user_id', auth()->id())
                        ->where('phone_id', $phoneId)
                        ->exists();

        if ($exists) {
            return response()->json(['message' => 'You have already reviewed this phone.'], 403);
        }

        $review = Review::create([
            'user_id' => auth()->id(),
            'phone_id' => $phoneId,
            'rating' => $request->rating,
            'comment' => $request->comment,
        ]);

        return response()->json(['message' => 'Review submitted!', 'review' => $review->load('user')], 201);
    }

    public function updateReview(Request $request, $id)
    {
        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'required|string|max:1000',
        ]);

        $review = Review::findOrFail($id);

        if ($review->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $review->update([
            'rating' => $request->rating,
            'comment' => $request->comment,
        ]);

        return response()->json(['message' => 'Review updated!', 'review' => $review->load('user')]);
    }

    public function deleteReview($id)
    {
        $review = Review::findOrFail($id);

        if ($review->user_id === auth()->id() || auth()->user()->isAdmin) {
            $review->delete();
            return response()->json(['message' => 'Review deleted.']);
        }

        return response()->json(['message' => 'Unauthorized'], 403);
    }
}
